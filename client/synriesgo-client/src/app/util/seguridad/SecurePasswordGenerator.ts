export class SecurePasswordGenerator {
    private allowedAlphaMayus = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private allowedAlphaMinus = 'abcdefghijklmnopqrstuvwxyz';
    private allowedNums = '0123456789';
    private allowedSpecial = '!$#%@*+-';

    constructor() {
    }

    public getSecurePassword() {
        let password = '';

        for (let i = 0; i < 5; i++) {
            password += this.allowedAlphaMayus[this.randomIntFromInterval(0, this.allowedAlphaMayus.length - 1)];
            password += this.allowedAlphaMinus[this.randomIntFromInterval(0, this.allowedAlphaMinus.length - 1)];
            password += this.allowedNums[this.randomIntFromInterval(0, this.allowedNums.length - 1)];
            password += this.allowedSpecial[this.randomIntFromInterval(0, this.allowedSpecial.length - 1)];
        }

        return password;
    }

    private randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}