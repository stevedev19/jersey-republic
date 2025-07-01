import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
    
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: String;
    memberPhone: String;
    memberPassword?: String;
    memberAddress?: String;
    memberDesc?: String;
    memberImage?: String;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAddress?: String;
    memberDesc?: String;
    memberImage?: String;
    memberPoints?: number;
}

export interface LoginInput {
    memberNick: string;
    memberPassword: string;
}