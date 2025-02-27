import { Client } from 'minio';

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'your-access-key',
    secretKey: process.env.MINIO_SECRET_KEY || 'your-secret-key',
});

const bucketName: string = process.env.MINIO_BUCKET_NAME;

const checkIfBucketExist = async () => {
    const isExist = await minioClient.bucketExists(bucketName);

    if (isExist) {
        return true;
    } else {
        /** Create Bucket in minio if doesn't exist */
        await minioClient.makeBucket(bucket, 'us-east-1');

        return false;
    }
};

export const uploadFile = async (fileName: string, file: File) => {
    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileMimeType = file.type;

        const res = await minioClient.putObject(
            process.env.MINIO_BUCKET_NAME,
            fileName,
            fileBuffer,
            file.size,
            {
                'Content-Type': fileMimeType,
            }
        );

        return { fileName, res };
    } catch (err) {
        return null;
    }
};

export const deleteFile = async (fileName: string) => {
    try {
        await minioClient.removeObject(bucketName, fileName);
    } catch (err) {
        console.log('Error in delete file:');
        console.log(err);
    }
};
