import axios from "../../api/axios";
import { getApiUrl } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  public async getTopUsers(): Promise<Member[]> {
    try {
      const result = await axios.get(getApiUrl("member/top-users"));
      const payload = Array.isArray((result.data as any)?.data)
        ? (result.data as any).data
        : result.data;
      return payload as Member[];
    } catch (err) {
      throw err;
    }
  }

  public async getRestaurant(): Promise<Member> {
    try {
      const result = await axios.get(getApiUrl("member/admin"));

      const platformAdmin: Member = result.data;
      return platformAdmin;
    } catch (err) {
      try {
        const legacyResult = await axios.get(getApiUrl("member/restaurant"));
        const platformAdmin: Member = legacyResult.data;
        return platformAdmin;
      } catch (legacyErr) {
        throw legacyErr;
      }
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const result = await axios.post(getApiUrl("member/signup"), input, {
        withCredentials: true,
      });
      const member: Member = (result.data as any)?.member ?? result.data;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const result = await axios.post(getApiUrl("member/login"), input, {
        withCredentials: true,
      });
      const member: Member = (result.data as any)?.member ?? result.data;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      await axios.post(getApiUrl("member/logout"), {}, { withCredentials: true });

      localStorage.removeItem("memberData");
    } catch (err) {
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberImage", input.memberImage || "");

      const result = await axios(getApiUrl("member/update"), {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      const member: Member = result.data;
      localStorage.setItem("memebrData", JSON.stringify(member));
      return member;
    } catch (err) {
      throw err;
    }
  }
}

export default MemberService;
