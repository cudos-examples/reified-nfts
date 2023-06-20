export interface Denom {
    id: string;
    name: string;
    schema: string;
    creator: string;
    symbol: string;
  }
  export interface Nft {
    id: string;
    name: string;
    uri?: string;
    data?: string;
    owner: string;
    approvedAddresses?: string[];
  }
  
  export interface Collection {
    denom: Denom;
    nfts?: Nft[];
  }
  
  export interface AllTokenResponse {
    collection: Collection;
    pagination?: Pagination;
  }
  
  export interface Pagination {
    total: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    nextkey: object;
  }
  
  export interface IssueMessage {
    id: string;
    name: string;
    symbol: string;
    from: string;
    schema: string;
    chainId: string;
    sender: string;
  }
  
  export interface MintMessage {
    denomId: string;
    name: string;
    uri: string;
    data: string;
    from: string;
    recipient: string;
    chainId: string;
  }
  