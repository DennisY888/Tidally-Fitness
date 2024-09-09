// ********** RIGHT NOW THIS IS ANDROID ONLY

import { Account, Client, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '66a030900035827881e6',
    databaseId: '66a0384e0009adac6650',
    userCollectionId: '66a03a75003c4f012eac',
    videoCollectionId: '66a03a9c0027c74298c9',
    storageId: '66a03ebc00355f17b5ab'
}


// destructure the properties of config so we don't have to type config.[property] everytime
const {
    endpoint, 
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config



// Init your React Native SDK, connection to AppWrite server
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) 
    .setPlatform(config.platform);



// Account object handles user-related operations such as
// creating users, logging in, loggin out, sessions, etc.
const account = new Account(client); // similar to User model
const avatars = new Avatars(client); // Avatars API for default pfp generation
const databases = new Databases(client); 
const storage = new Storage(client);





// All the functions we built

export const createUser = async (email, password, username) => {
    try {

        //*** creates the user account */
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        // generates an avatar image based on username initials
        // default profile pictures
        const avatarUrl = avatars.getInitials(username);


        //*** sign the user in */
        await signIn(email, password)


        //*** store additional user data in our self-created users database */
        // our users table does not store password, it is stored in Auth
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(), //document ID (we don't have one since it is a new row)
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            } // an object containing all the data about user
        )

        return newUser
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}



export const signIn = async (email, password) => {
    try {
        // built-in AppWrite function for validating user login
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}



export const getCurrentUser = async () => {
    try {
        // get current logged in account
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
    
        // get the user from users collection, returns an array of documents (rows)
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
          [Query.equal("accountId", currentAccount.$id)]
        );
    
        if (!currentUser) throw Error;
    
        // only one user
        return currentUser.documents[0];
      } catch (error) {
        console.log(error);
      }
}



export const getAllPosts = async () => {
    try {
        // fetches all posts
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



export const getLatestPosts = async () => {
    try {
        // fetches all posts
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



export const searchPosts = async (query) => {
    try {
        // fetches all posts
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            // see if title CONTAINS query, does not need to exactly match
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



export const getUserPosts = async (userId) => {
    try {
        // fetches all posts
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            // see if title CONTAINS query, does not need to exactly match
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



export const signOut = async () => {
    try {
        // delete current session
        const session = await account.deleteSession('current')

        // return the session we just ended
        return session
    } catch (error) {
        throw new Error(error)
    }
}










export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === 'image') {
            // width 2000, height 2000, gravity 'top', quality 100
            fileUrl = storage.getFilePreview(storageId, fileId,
                2000, 2000, 'top', 100
            );
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) {
            throw Error;
        }

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}





// uploads given file to AppWrite storage buckets
// file param contains the local path, name, size, and type of file
export const uploadFile = async (file, type) => {
    if (!file) return;

    const {mimeType, ...rest} = file;
    // we just add type: in front of mimeType to help AppWrite better understand the format
    const asset = {type: mimeType, ...rest};


    /* if we use ImagePicker instead of DocumentPicker:
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    */



    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        // get the file url from AppWrite
        // getFilePreview is a bit different for video and image
        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl
    } catch (error) {
        throw new Error(error);
    }
}





// uploading the whole post (video, thumbnail, title, prompt) to appwrite
export const createVideo = async (form) => {
    try {
        // first upload video and thumbnail, then get urls for both so that we can store in our database
        // we can upload both at the same time, independent of one another
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])


        // once we have all the urls returned from the two other functions we created, we can create a new post in our database
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

    } catch (error) {
        throw new Error(error);
    }
}