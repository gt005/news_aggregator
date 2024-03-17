export interface JwtToken {
    access_token: string,
    refresh_token: string,
}

export interface AuthorizationToken {
    email: string,
    token: string,
}

export interface OtpCode {
    email: string,
    code: number,
}
