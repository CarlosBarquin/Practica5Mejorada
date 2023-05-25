import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";


let client: ApolloClient<NormalizedCacheObject> | undefined = undefined

const CSRClient = new ApolloClient({
    uri: "http://127.0.0.1:8080",
    cache: new InMemoryCache(),
});

export const getCSRClient = () => {
    return CSRClient;
}

export const 
getSSRClient = () => {
        if(!client || window === undefined){
            return new ApolloClient({
                uri: "http://back:8080",
                cache: new InMemoryCache(),
});
        }else{
            return CSRClient;
        }
         
}

