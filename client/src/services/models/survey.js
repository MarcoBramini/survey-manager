import * as dayjs from "dayjs";
import Question from "./question";

class Survey {
  constructor(
    id = null,
    title,
    description,
    createdAt = null, // iso8601 string
    isPublished = false,
    publishedAt = null, // iso8601 string
    estCompletionMinutes,
    questions = [],
    submitsCount = 0,
    userID
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt ? dayjs(createdAt) : null;
    this.isPublished = isPublished;
    this.publishedAt = publishedAt ? dayjs(publishedAt) : null;
    this.estCompletionMinutes = estCompletionMinutes;
    this.questions = questions;
    this.submitsCount = submitsCount;
    this.userID = userID;
  }

  static fromJSON(json) {
    let s = new Survey(
      json.id,
      json.title,
      json.description,
      json.createdAt,
      json.isPublished,
      json.publishedAt,
      json.estCompletionMinutes,
      null, // Questions will be set later
      json.submitsCount,
      json.userID
    );

    if (json.questions) {
      let questions = json.questions.map((question) =>
        Question.fromJSON(question)
      );
      s.questions = questions;
    }

    return s;
  }
}

export default Survey;
