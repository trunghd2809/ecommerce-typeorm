interface Address {
  addr1?: string;
  addr2?: string;
  city?: string;
  state?: string;
  zip?: number;
}

export interface User {
  id: number;
  username: string;
  seller: boolean;
  address: Address;
}