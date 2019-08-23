
const crypto = require("crypto");
const rp = require("request-promise-native");
const qs = require("qs");

const hashableBody = body => {
    if (typeof body === "string" || body instanceof Buffer) {
        return body;
    }

    return JSON.stringify(body);
};

const constructUri = (uri, params) => {
    if (!params) {
        return uri;
    }

    const paramString = qs.stringify(params || {});

    if (paramString.length < 1) {
        return uri;
    }

    const separator = uri.includes('?') ? '&' : '?';

    return uri + separator + paramString;
};

const request = (baseUrl, identifier, secret) => options => {
    const date = options.headers && options.headers["Date"] || new Date().toUTCString();
    const body = hashableBody(options.body || "");
    const contentMd5 = crypto
        .createHash("md5")
        .update(body)
        .digest("base64");

    const contentType = options.headers && options.headers["Content-Type"] || "application/json";
    const method = options.method || "GET";
    const macUri = constructUri(options.uri, options.qs);

    const macString = [method, contentMd5, contentType, date, macUri].join("\n");
    const mac = crypto
        .createHmac("sha512", secret)
        .update(macString)
        .digest("base64");

    const authorization = `Onnistuu ${identifier}:${mac}`;

    return rp(
        Object.assign(
            {},
            options,
            {
                baseUrl: baseUrl,
                body: body,
                resolveWithFullResponse: true,
                followRedirect: false,
                headers: Object.assign(
                    {},
                    options.headers || {},
                    {
                        Date: date,
                        "Content-MD5": contentMd5,
                        "Content-Type": contentType,
                        Authorization: authorization
                    }
                )
            }
        )
    );
};

class VismaSign {
    constructor(baseUrl, identifier, secret) {
        this.request = request(baseUrl, identifier, secret);
    }

    async createDocument(document) {
        const response = await this.request(
            {
                method: 'POST',
                uri: '/api/v1/document/',
                body: document
            }
        );
        
        return response.headers.location.split('/').pop();
    }

    async addFile(documentUuid, fileContent, fileName) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/document/${documentUuid}/files`,
                body: fileContent,
                headers: { "Content-Type": "application/pdf" },
                qs: {
                    filename: fileName
                }
            }
        );
        
        return JSON.parse(response.body).uuid;
    }

    async createInvitations(documentUuid, invitations) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/document/${documentUuid}/invitations`,
                body: invitations
            }
        );
        
        return JSON.parse(response.body);
    }

    async getInvitation(invitationUuid) {
        const response = await this.request(
            {
                uri: `/api/v1/invitation/${invitationUuid}`
            }
        );

        return JSON.parse(response.body);
    }

    async getDocument(documentUuid) {
        const response = await this.request(
            {
                uri: `/api/v1/document/${documentUuid}`
            }
        );

        return JSON.parse(response.body);
    }

    async getDocumentFile(documentUuid) {
        const response = await this.request(
            {
                encoding: null,
                uri: `/api/v1/document/${documentUuid}/files/0`
            }
        );

        return response.body;
    }

    async cancelDocument(documentUuid) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/document/${documentUuid}/cancel`
            }
        );

        return response.statusCode === 200;
    }

    async deleteDocument(documentUuid) {
        const response = await this.request(
            {
                method: 'DELETE',
                uri: `/api/v1/document/${documentUuid}`
            }
        );

        return response.statusCode === 200;
    }

    async getAuthMethods() {
        const response = await this.request(
            {
                uri: `/api/v1/auth/methods`
            }
        );

        return JSON.parse(response.body);
    }

    async fulfillInvitation(invitationUuid, returnUrl, identifier, authService) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/invitation/${invitationUuid}/signature`,
                body: {
                    returnUrl,
                    identifier,
                    authService
                }
            }
        );

        return response.headers.location;
    }

    async remindDocument(documentUuid) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/document/${documentUuid}/remind`
            }
        );

        return response.statusCode === 200;
    }

    async remindInvitation(invitationUuid) {
        const response = await this.request(
            {
                method: 'POST',
                uri: `/api/v1/invitation/${invitationUuid}/remind`
            }
        );

        return response.statusCode === 200;
    }

    async searchDocuments(options) {
        const response = await this.request(
            {
                uri: `/api/v1/document/`,
                qs: options
            }
        );

        return JSON.parse(response.body);
    }

    async getCategories() {
        const response = await this.request(
            {
                uri: `/api/v1/category/`
            }
        );

        return JSON.parse(response.body);
    }

    async createCategory(category) {
        const response = await this.request(
            {
                method: 'POST',
                uri: '/api/v1/category/',
                body: category
            }
        );
        
        return response.headers.location.split('/').pop();
    }

    async deleteCategory(categoryUuid) {
        const response = await this.request(
            {
                method: 'DELETE',
                uri: `/api/v1/category/${categoryUuid}`
            }
        );

        return response.statusCode === 204;
    }

    async updateCategory(categoryUuid, category) {
        const response = await this.request(
            {
                method: 'PATCH',
                uri: `/api/v1/category/${categoryUuid}`,
                body: category
            }
        );

        return response.statusCode === 204;
    }

    async getInviteeGroups() {
        const response = await this.request(
            {
                uri: `/api/v1/invitee-group/`
            }
        );

        return JSON.parse(response.body);
    }

    async getSavedEmailMessages() {
        const response = await this.request(
            {
                uri: `/api/v1/saved-invitation-message/email/`
            }
        );

        return JSON.parse(response.body);
    }

    async getSavedSmsMessages() {
        const response = await this.request(
            {
                uri: `/api/v1/saved-invitation-message/sms/`
            }
        );

        return JSON.parse(response.body);
    }
}

module.exports = VismaSign;