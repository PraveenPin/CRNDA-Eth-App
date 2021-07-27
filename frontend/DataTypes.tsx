export default interface UserDetails{
    id: number;
    name: string;
    followersCount: number;
    followingCount: number;
    tipObtained: number;
    tipDonated: number;
}

export type FormData = {
    name: string;
    email: string;
    password: string;
};

export type PostFormData = {
    postContent: string;
    postUrl?: string;
    imageHash?: string;
};

export type ExplorePageState = {
    initialSetup: boolean,
    allPosts: Array<any>,
    headerText: string,
    searchKeyWord: string,
    showSearchResults: boolean,
    searchResults: Array<any>,
    tickerData: string
};