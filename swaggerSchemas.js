/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         universityNumber:
 *           type: string
 *           description: The university number of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         profilePicture:
 *           type: string
 *           description: The URL of the user's profile picture.
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: The role of the user (admin or user).
 *         score:
 *           type: integer
 *           description: The score of the user.
 *
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the question.
 *         title:
 *           type: string
 *           description: The title of the question.
 *         description:
 *           type: string
 *           description: The description of the question.
 *         functionName:
 *           type: string
 *           description: The name of the function to be implemented.
 *         parameters:
 *           type: array
 *           items:
 *             type: object
 *           description: The parameters of the function.
 *         returnType:
 *           type: string
 *           description: The return type of the function.
 *         testCases:
 *           type: array
 *           items:
 *             type: object
 *           description: The test cases for the question.
 *         difficultyLevelId:
 *           type: integer
 *           description: The ID of the difficulty level associated with the question.
 *
 *     DifficultyLevel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the difficulty level.
 *         level:
 *           type: string
 *           description: The name of the difficulty level.
 *         points:
 *           type: integer
 *           description: The points associated with the difficulty level.
 *
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the favorite entry.
 *         userId:
 *           type: integer
 *           description: The ID of the user who favorited the question.
 *         questionId:
 *           type: string
 *           format: uuid
 *           description: The ID of the question that was favorited.
 *
 *     Submission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the submission.
 *         userId:
 *           type: integer
 *           description: The ID of the user who submitted the code.
 *         questionId:
 *           type: string
 *           format: uuid
 *           description: The ID of the question being solved.
 *         languageId:
 *           type: integer
 *           description: The ID of the programming language used.
 *         sourceCode:
 *           type: string
 *           description: The source code submitted by the user.
 *         result:
 *           type: object
 *           description: The result of the code execution.
 *         timeTaken:
 *           type: number
 *           format: float
 *           description: The time taken to execute the code.
 *         memoryUsed:
 *           type: integer
 *           description: The memory used during code execution.
 *
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the session.
 *         userId:
 *           type: integer
 *           description: The ID of the user associated with the session.
 *         token:
 *           type: string
 *           description: The session token.
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: The expiration time of the session.
 */
