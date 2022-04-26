
export interface ITryggerUser {
    id: string,
    createdAt: Date,
    email: string,
    phoneNumber: string,
    walletAddress: string,
    activated: boolean,
    tier: string,
}