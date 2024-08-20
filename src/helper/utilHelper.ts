
class UtilHelper {
    createOtpNumber(length: number): number {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    createRandomText(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    // Method to move a file from one location to another
    // moveFile(
    //     file: UploadedFile,
    //     destination: string,
    //     successCB: () => void,
    //     errorCB: (err: Error) => void
    // ): void {
    //     console.log("Dir name is:");
    //     console.log(__dirname);

    //     file.mv(destination, (err: Error) => {
    //         if (err) {
    //             return errorCB(err);
    //         } else {
    //             return successCB();
    //         }
    //     });
    // }
}

export default UtilHelper;
