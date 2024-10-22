import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError from '../errors/custom.error';
import { CustomObjectController } from './custom-object.controller';

const customObjectController = new CustomObjectController();
export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { container, key, value, schemaType } = request.body;

  if (!container || !key || !value || !schemaType) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }

  try {
    const result = await customObjectController.createOrUpdateCustomObject(
      container,
      key,
      JSON.parse(value),
      schemaType
    );
    apiSuccess(200, result, response);
    return result;
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};
