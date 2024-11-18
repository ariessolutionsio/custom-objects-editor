/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError from '../errors/custom.error';
import { getNodeClient } from '../client/apollo.client';
import { CustomObjectController } from 'shared-code';

export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { container, key, value, schemaType } = request.body;

  if (!container || !key || !value || !schemaType) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }

  const client = await getNodeClient();
  const customObjectController = new CustomObjectController(client);

  try {
    const result = await customObjectController.createOrUpdateCustomObject(
      container,
      key,
      value,
      schemaType
    );
    apiSuccess(200, result, response);
    return result;
  } catch (error) {
    response.status(400).json({
      // @ts-ignore
      message: error.message,
    });
  }
};
