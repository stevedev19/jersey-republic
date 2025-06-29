import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
// Schema first & code first
//Schema first

//Schema oraqali object yasaymiz
const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memeberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false, //by default olib berma
      required: true,
    },

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },

    memberAddress: {
      type: String,
    },

    memberDesc: {
      type: String,
    },
  },
  { timestamps: true } // updatedAt & createdAt ni qoyib beradi
);

export default mongoose.model("Member", memberSchema);