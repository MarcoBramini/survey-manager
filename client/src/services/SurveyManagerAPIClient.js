import Survey from "./models/survey";
import SurveyAttempt from "./models/surveyAttempt";

// ------
// Survey
// ------

export async function createSurvey(
  title,
  description,
  isPublished,
  estCompletionMinutes
) {
  const response = await fetch("/survey-manager/apis/admin/surveys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
      isPublished: isPublished,
      estCompletionMinutes: estCompletionMinutes,
    }),
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 200:
      return responseBody.newSurveyID;
    default:
      throw new Error("An error occurred during survey creation");
  }
}

export async function getAvailableSurveys(searchValue, limit, order) {
  const url = new URL("http://localhost:3000/survey-manager/apis/surveys");
  if (searchValue) {
    url.searchParams.append("search", searchValue);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (order) {
    url.searchParams.append("order", order);
  }

  const response = await fetch(url.pathname + url.search, {
    method: "GET",
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 200:
      let surveys = [];
      for (let surveyJSON of responseBody) {
        surveys.push(Survey.fromJSON(surveyJSON));
      }
      return surveys;
    default:
      throw new Error("An error occurred retrieving the survey list");
  }
}

export async function getSurvey(surveyID) {
  const response = await fetch("/survey-manager/apis/surveys/" + surveyID, {
    method: "GET",
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 200:
      return Survey.fromJSON(responseBody);
    default:
      throw new Error("An error occurred retrieving the survey");
  }
}

export async function getOwnedSurveys(limit, order) {
  const url = new URL(
    "http://localhost:3000/survey-manager/apis/admin/surveys"
  );
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (order) {
    url.searchParams.append("order", order);
  }

  const response = await fetch(url.pathname + url.search, {
    method: "GET",
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      let surveys = [];
      for (let surveyJSON of responseBody) {
        surveys.push(Survey.fromJSON(surveyJSON));
      }
      return surveys;
    default:
      throw new Error("An error occurred retrieving the survey list");
  }
}

export async function getOwnedSurvey(surveyID) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" + surveyID,
    {
      method: "GET",
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return Survey.fromJSON(responseBody);
    default:
      throw new Error("An error occurred retrieving the survey");
  }
}

export async function updateSurvey(survey) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" + survey.id,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: survey.title,
        description: survey.description,
        createdAt: survey.createdAt?.toISOString(),
        isPublished: survey.isPublished,
        publishedAt: survey.publishedAt?.toISOString(),
        estCompletionMinutes: survey.estCompletionMinutes,
        submitsCount: survey.submitsCount,
        userID: survey.userID,
      }),
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return responseBody.updatedSurveyID;
    default:
      throw new Error("An error occurred during survey update");
  }
}

export async function deleteSurvey(surveyID) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" + surveyID,
    {
      method: "DELETE",
    }
  );

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 204:
      return;
    default:
      throw new Error("An error occurred during survey deletion");
  }
}

// -------------
// SurveyAttempt
// -------------

export async function submitSurveyAttempt(
  surveyID,
  userFullName,
  startedAt,
  answers
) {
  const response = await fetch(
    "/survey-manager/apis/surveys/" + surveyID + "/attempts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userFullName: userFullName,
        startedAt: startedAt,
        answers: answers,
      }),
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 200:
      return responseBody.newSurveyID;
    default:
      throw new Error("An error occurred submitting the attempt");
  }
}

export async function getOwnedSurveyAttempts(
  surveyID,
  searchValue,
  limit,
  order
) {
  const url = new URL(
    `http://localhost:3000/survey-manager/apis/admin/surveys/${surveyID}/attempts`
  );
  if (searchValue) {
    url.searchParams.append("search", searchValue);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (order) {
    url.searchParams.append("order", order);
  }

  const response = await fetch(url.pathname + url.search, {
    method: "GET",
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      let surveyAttempts = [];
      for (let surveyAttemptJSON of responseBody) {
        surveyAttempts.push(SurveyAttempt.fromJSON(surveyAttemptJSON));
      }
      return surveyAttempts;
    default:
      throw new Error("An error occurred retrieving the survey attempts list");
  }
}

// --------
// Question
// --------

export async function createQuestion(
  surveyID,
  title,
  type,
  isOptional,
  maxAnswerLength,
  minChoices,
  maxChoices,
  options
) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" + surveyID + "/questions/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        type: type,
        isOptional: isOptional,
        maxAnswerLength: maxAnswerLength,
        minChoices: minChoices,
        maxChoices: maxChoices,
        options: options,
      }),
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return responseBody.newQuestionID;
    default:
      throw new Error("An error occurred during question creation");
  }
}

export async function updateQuestion(surveyID, question) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" +
      surveyID +
      "/questions/" +
      question.id,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: question.title,
        type: question.type,
        isOptional: question.isOptional,
        maxAnswerLength: question.maxAnswerLength,
        minChoices: question.minChoices,
        maxChoices: question.maxChoices,
        options: question.options,
      }),
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return responseBody.updatedQuestionID;
    default:
      throw new Error("An error occurred during question update");
  }
}

export async function positionUpQuestion(surveyID, questionID) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" +
      surveyID +
      "/questions/" +
      questionID +
      "/positionUp",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return responseBody.updatedQuestionID;
    default:
      throw new Error("An error occurred updating question position");
  }
}

export async function positionDownQuestion(surveyID, questionID) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" +
      surveyID +
      "/questions/" +
      questionID +
      "/positionDown",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 200:
      return responseBody.updatedQuestionID;
    default:
      throw new Error("An error occurred updating question position");
  }
}

export async function deleteQuestion(questionID, surveyID) {
  const response = await fetch(
    "/survey-manager/apis/admin/surveys/" +
      surveyID +
      "/questions/" +
      questionID,
    {
      method: "DELETE",
    }
  );

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(
        "User is not authenticated or has insufficient privileges"
      );
    case 204:
      return;
    default:
      throw new Error("An error occurred during question deletion");
  }
}
