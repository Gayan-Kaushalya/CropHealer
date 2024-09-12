import React, { useCallback} from 'react';
import Mailer from 'react-native-mail';

const useSendEmail = ({prediction, reality}) => {
    const sendEmail = useCallback(
        ({ body = '', isHTML = false, attachments} = {}) => {
            return new Promise((resolve, reject) => {
                Mailer.mail({
                    subject: 'Wrong Plant Disease Prediction',

            recipients: ['gaykaush@gmail.com'],
            body: `The model predicted ${prediction} but the actual disease is ${reality}`,
            isHTML,
            attachments,
        }, (error, event) => {
            if (error) {
                return reject(error);
            }
            resolve(event);
        }
        );
    });
},
    [prediction, reality]
);

return sendEmail;
};

export default useSendEmail;