export interface JwtResponse{
    accessToken: string,
    accessType: string,
    email: string,
    roles: string[]
}