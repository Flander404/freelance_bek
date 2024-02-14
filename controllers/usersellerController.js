const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserSeller } = require("../models/models");
const client = require("twilio")(
  "ACbf3be024152b47cd3dd395604494e715",
  "a6ac2299db5162d37f32df3108b753d9"
);

const generateJwt = (id, email, role, name, number, inn) => {
  return jwt.sign(
    { id, email, role, name, number, inn },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class UsersellerController {
  async registration(req, res, next) {
    const { email, role, name, number, inn } = req.body;
    try {
      const usernumber = await UserSeller.findOne({ where: { number } });
      if (usernumber) {
        if (usernumber.confirmed === true) {
          return res.json({ message: "Этот номер уже используется" });
        } else if (usernumber.confirmed === false) {
          const code = Math.floor(1000 + Math.random() * 9000).toString();
          await UserSeller.update(
            { confirmationCode: code },
            { where: { number } }
          );
          await client.messages.create({
            body: `Ваш код подтверждения: ${code}`,
            from: "+16592465741",
            to: usernumber.number,
          });
          return res.json({ message: "Ваш код отправлен на ваш номер" });
        }
      }
      if (!usernumber) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        const user = await UserSeller.create({
          email,
          role,
          name,
          number,
          inn,
          confirmationCode: code,
          confirmed: false,
        });
        await client.messages.create({
          body: `Ваш код подтверждения: ${code}`,
          from: "+16592465741",
          to: user.number,
        });
        return res.json({ message: "Ваш код отправлен на ваш номер" });
      }
    } catch (error) {
      console.log(error);
      return next(ApiError.badRequest("Ошибка при регестрации"));
    }
  }
  // async registration(req, res, next) {
  //   const { email, role, name, number, inn } = req.body; // изменено на inn
  //   if (!inn || !number) {
  //     return next(ApiError.badRequest("Некорректный ИНН или НОМЕР"));
  //   }

  //   try {
  //     const code = Math.floor(1000 + Math.random() * 9000).toString();

  //     const user = await UserSeller.create({
  //       email,
  //       role,
  //       name,
  //       number,
  //       inn,
  //       confirmationCode: code,
  //       confirmed: false,
  //     });

  //     await client.messages.create({
  //       body: `Ваш код подтверждения: ${code}`,
  //       from: "+16592465741",
  //       to: user.number,
  //     });
  //     const existingNumber = await UserSeller.findOne({ where: { number } }); // изменено на inn
  //     if (existingNumber.confirmed === true) {
  //       return next(
  //         ApiError.badRequest("Пользователь с таким номером уже существует")
  //       );
  //     }

  //     const existingInn = await UserSeller.findOne({ where: { inn } });
  //     if (existingInn) {
  //       return next(
  //         ApiError.badRequest("Пользователь с таким ИНН уже существует")
  //       );
  //     }
  //     if (existingNumber.confirmed === false) {
  //       const code = Math.floor(1000 + Math.random() * 9000).toString();
  //       await client.messages.create({
  //         body: `Ваш код подтверждения: ${code}`,
  //         from: "+16592465741",
  //         to: user.number,
  //       });
  //     }

  //     return res.json({ message: "Ваш код отправлен на ваш номер" });
  //   } catch (error) {
  //     console.log(error);
  //     return next(ApiError.badRequest("Ошибка при регистрации"));
  //   }
  // }
  async confirmRegistration(req, res, next) {
    const { number, confirmationCode } = req.body;

    try {
      const user = await UserSeller.findOne({
        where: { number, confirmationCode },
      });
      if (!user) {
        return next(ApiError.badRequest("Неверный код подтверждения или номер телефона"));
      }
      if (user.confirmed === true) {
        const token = generateJwt(
          user.id,
          user.email,
          user.role,
          user.name,
          user.number,
          user.inn
        );
        return res.json({ message: "Вы успешно вошли", token });
      } else if (user.confirmed === false) {
        user.confirmed = true;
        await user.save();

        // Генерируем JWT-токен
        const token = generateJwt(
          user.id,
          user.email,
          user.role,
          user.name,
          user.number,
          user.inn
        );

        return res.json({ message: "Вы успешно прошли регистрацию", token });
      }
    } catch (error) {
      console.log(error);
      return next(ApiError.badRequest("Ошибка при проверке"));
    }
  }
  async login(req, res, next) {
    const { number } = req.body;

    try {
      const user = await UserSeller.findOne({ where: { number } });
      if (!user) {
        return res.json({ message: "Такой номер еще не зарегестрирован" });
      }
      if (user) {
        if (user.confirmed === true) {
          const code = Math.floor(1000 + Math.random() * 9000).toString();
          await UserSeller.update(
            {
              confirmationCode: code,
            },
            { where: { number } }
          );
          await client.messages.create({
            body: `Ваш код подтверждения: ${code}`,
            from: "+16592465741",
            to: user.number,
          });
          return res.json({ message: "Ваш код отправлен на ваш номер" });
        }
        if (user.confirmed === false) {
          return res.json({ message: "Такой номер еще не прошел регестрацию" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.json({ message: "Ошибка при входе" });
    }
  }

  async check(req, res, next) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("Не задано ID"));
    }
    res.json(id);
  }
}

module.exports = new UsersellerController();
