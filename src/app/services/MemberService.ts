import axios from "../../api/axios";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = ""; // axios baseURL handles host
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      let url = this.path + "member/top-users";
      const result = await axios.get(url);
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
      const adminUrl = this.path + "member/admin";
      const result = await axios.get(adminUrl);

      const platformAdmin: Member = result.data;
      return platformAdmin;
    } catch (err) {
      try {
        const legacyUrl = this.path + "member/restaurant";
        const legacyResult = await axios.get(legacyUrl);
        const platformAdmin: Member = legacyResult.data;
        return platformAdmin;
      } catch (legacyErr) {
        throw legacyErr;
      }
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "member/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      const member: Member = (result.data as any)?.member ?? result.data;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "member/login";
      const result = await axios.post(url, input, { withCredentials: true });
      const member: Member = (result.data as any)?.member ?? result.data;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "member/logout";
      await axios.post(url, {}, { withCredentials: true });

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

      const url = this.path + "member/update";

      const result = await axios(url, {
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
