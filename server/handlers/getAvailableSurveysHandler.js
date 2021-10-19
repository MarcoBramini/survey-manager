"use strict";

const { query } = require("express-validator");

const dao = require("../dao/dao");

exports.getAvailableSurveysValidationChain = [
  query("search").optional({ nullable: true }).isString(),
  query("limit").optional({ nullable: true }).isInt(),
  query("order")
    .optional({ nullable: true })
    .isIn([
      "+submitsCount",
      "-submitsCount",
      "+createdAt",
      "-createdAt",
      "+publishedAt",
      "-publishedAt",
      "+title",
      "-title",
    ]),
];

exports.getAvailableSurveysHandler = async (req, res) => {
  return await dao
    .getAvailableSurveys(req.query.search, req.query.limit, req.query.order)
    .then((surveys) => res.status(200).json(surveys))
    .catch((err) => {
      console.error(
        "dao.getAvailableSurveys(",
        "\nsearch:",
        req.query.search,
        "\nlimit:",
        req.query.limit,
        "\norder:",
        req.query.order,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
