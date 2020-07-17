import * as express from 'express';

import { request, APIError, ParameterError } from './utils';

import {
    IEditMerchantParams,

    IPayment,
    IGetUserResponse,
    IGetMerchantResponse
} from './declarations';

export class MineBattle {
    private token: string;
    private baseURL: string = 'https://minebattle.ru/api';

    private isStarted: boolean = false;
    private onPaymentCallback: (payment: IPayment) => void;

    /**
     * @param token Токен мерчанта
     */
    public constructor(token: string) {
        if (!token) {
            throw new ReferenceError(
                'Параметр `token` обязателен'
            );
        }

        this.token = token;
    }

    /* API */

    /**
     * Универсальный метод отправки запроса
     * @param methodName Имя метода
     * @param params Параметры метода
     */
    public async call(methodName: string, params?: object) {
        if (!methodName) {
            throw new ParameterError(
                'methodName'
            );
        }

        const json = await request(`${this.baseURL}/${methodName}`, {
            token: this.token,
            ...params
        });

        if (json.error) {
            throw new APIError({
                code: json.error.error_code,
                type: json.error.error_type,
                message: json.error.error_message
            });
        }

        return json.response;
    }

    /**
     * Получить информацию о пользователе
     * @param userId Айди пользователя
     */
    public async getUserInfo(userId: number): Promise<IGetUserResponse> {
        return this.call('user.get', {
            user_id: userId
        });
    }

    /**
     * Получить информацию о данном мерчанте
     */
    public getMerchantInfo(): Promise<IGetMerchantResponse> {
        return this.call('merchant.get');
    }

    /**
     * Обновить информацию мерчанта
     * @param params Новая информация мерчанта
     */
    public editMerchantInfo(params: IEditMerchantParams): Promise<IGetMerchantResponse> {
        return this.call('merchant.edit', params);
    }

    /**
     * Выставить счёт пользователю
     * @param targetId Айди пользователя, которому нужно выставить счёт
     * @param amount Количество запрашиваемых монет
     */
    public createBill(targetId: number, amount: number): Promise<boolean> {
        return this.call('transfer.create', {
            amount,
            to_id: targetId
        });
    }

    /**
     * Сделать перевод пользователю
     * @param targetId Айди пользователя, которому нужно сделать перевод
     * @param amount Количество отправляемых монет
     */
    public sendPayment(targetId: number, amount: number): Promise<boolean> {
        return this.call('payment.send', {
            amount,
            to_id: targetId
        });
    }

    /**
     * Обновить вебхук для мерчанта
     * @param url Прямая ссылка на вебхук
     */
    public setWebhook(url: string): Promise<string> {
        return this.call('webhook.set', { url });
    }

    /* UPDATES */

    /**
     * Запустить вебхук
     * @param path Путь хука, например '/payment'
     * @param port Порт, на котором будет запущен хук
     */
    public async startWebhook(path: string, port: number): Promise<void> {
        if (this.isStarted) {
            throw new ReferenceError(
                'Вебхук уже запущен'
            );
        }

        const { webhook_url } = await this.getMerchantInfo();

        if (!webhook_url) {
            throw new ReferenceError(
                'Перед запуском вебхука, нужно установить значение webhook_url'
            );
        }

        return new Promise((resolve) => {
            const app = express();

            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));

            app.post(path, (req, res) => {
                res.send('ok');

                if (req.body?.transfer_accept) {
                    const {
                        amount,
                        from_id,
                        updated_merchant_balance,
                        updated_user_balance
                    } = req.body.transfer_accept;

                    this.onPaymentCallback({
                        amount, from_id,
                        updated_merchant_balance,
                        updated_user_balance
                    });
                }
            });

            app.listen(port, () => {
                resolve();
                this.isStarted = true;
            });
        });
    }

    /**
     * Подписаться на события новых входящих платежей
     * @param callback Функция обратного вызова, для приёма платежей
     */
    public onPayment(callback: (payment: IPayment) => void) {
        this.onPaymentCallback = callback;
    }
}