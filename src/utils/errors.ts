import { IAPIErrorParams } from '../declarations';

export class APIError extends Error {
    /**
     * Код ошибки
     */
    public code: number;
    /**
     * Тип ошибки
     */
    public type: string;
    /**
     * Сообщение ошибки
     */
    public message: string;

    /**
     * @param params Параметры ошибки
     */
    public constructor(params: IAPIErrorParams) {
        super(params.message);

        this.code = params.code;
        this.type = params.type;
        this.message = params.message;

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ParameterError extends Error {
    /**
     * @param parameter Название параметра
     */
    public constructor(parameter: string) {
        super(`Вы не указали параметр \`${parameter}\``);
    }
}