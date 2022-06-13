type Pixel = {
    line: number,
    column: number,
    white: boolean
}
type PixelMatrix = Array<Array<Pixel>>;

const getNumber = (str: string) : number => {
    const val = parseInt(str.trim(), 10);
    if(isNaN(val)) {
        throw Error(`Expected [${str}] to be number`);
    }
    return val;
}

const distance = (pixelA: Pixel, pixelB: Pixel) : number => Math.abs(pixelA.line - pixelB.line) + Math.abs(pixelA.column - pixelB.column);

const findShortestDistance = (pixel: Pixel, whitePixels: Array<Pixel>) => Math.min(...whitePixels.map(white => distance(pixel, white)))

const getPixels = (width: number, bitmapLines: Array<string>) : PixelMatrix => bitmapLines.map((row, line) => {
    const chars = Array.from(row);
    if (chars.length !== width) {
        throw new Error(`Bitmap\n[\n${bitmapLines.join('\n')}\n]\nexpected width = ${width}`)
    }
    return chars.map((v, column) => ({ line, column, white: getNumber(v) === 1 }));
});

const calculateBitmap = (pixelMatrix: PixelMatrix) : string => {
    const flat = pixelMatrix.flat();
    const whitePixels = flat.filter(pixel => pixel.white);
    const output = pixelMatrix.map(row => row.map(pixel => pixel.white ? 0 : findShortestDistance(pixel, whitePixels)).join(' '));

    return output.join('\n');
}

const calculateBitmaps = (input: string) : string => {
    const [amountLine, ...inputBitmaps] = input.split(/\r?\n/);
    const amount = getNumber(amountLine);
    const bitmapsInInput = inputBitmaps.filter(line => line === '').length + 1;
    if (bitmapsInInput !== amount) {
        throw new Error(`Expected [${amount}] bitmaps in input, found [${bitmapsInInput}]`);
    }
    const bitmaps = inputBitmaps.join('\n').split(/(\r?\n){2}/).filter(line => line !== '\n');
    const outputs = bitmaps.map(bitmapData => {
        const lines = bitmapData.split(/\r?\n/);
        const [height, width] = lines[0].split(' ').map(n => getNumber(n));

        if (lines.length - 1 !== height) {
            throw new Error(`Bitmap\n[\n${lines.join('\n')}\n]\nexpected height = ${height}`)
        }

        const bitmapLines = lines.slice(1, 1 + height);
        const pixels = getPixels(width, bitmapLines);
        return calculateBitmap(pixels);
    });
    return outputs.join('\n');
}

const readStream = (stream: NodeJS.ReadableStream) : Promise<string> => new Promise((resolve, reject) => {
    stream.setEncoding('utf8');
    let buffer = '';
    stream.on('data', chunk => buffer += chunk);
    stream.on('end', () => {
        resolve(buffer);
    });
    stream.on('error', reject);
});


export {
    getNumber,
    distance,
    calculateBitmap,
    findShortestDistance,
    getPixels,
    calculateBitmaps,
    readStream,
};
