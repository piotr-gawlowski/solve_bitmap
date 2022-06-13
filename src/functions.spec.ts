import { Readable } from 'stream';
import {
    readStream,
    distance,
    findShortestDistance,
    calculateBitmap,
    calculateBitmaps,
    getPixels,
    getNumber,
} from './functions';


//
const mockStdIn = jest.fn().mockImplementation(() => {
    const readable = new Readable();
    readable.setEncoding('utf8');
    readable.push('1\n');
    readable.push('2 2\n');
    readable.push('10\n');
    readable.push('01');
    readable.push(null);
    return readable;
});
test('Read from stream', async () => {
    const data = await readStream(mockStdIn());
    expect(data).toBe('1\n2 2\n10\n01');
});

//

test('Get number "10" to success', () => {
    expect(getNumber('10')).toBe(10);
});
test('Get number "a" to throw', () => {
    expect(() => getNumber('a')).toThrowError(/to be number/)
});

//

test('Distance in the same line = 3', () => {
    const pixelA = { line: 0, column: 0, white: false};
    const pixelB = { line: 0, column: 3, white: true};

    expect(distance(pixelA, pixelB)).toBe(3);
});
test('Distance in the same column = 4', () => {
    const pixelA = { line: 0, column: 0, white: false};
    const pixelB = { line: 4, column: 0, white: true};

    expect(distance(pixelA, pixelB)).toBe(4);
});
test('Distance far away = 60', () => {
    const pixelA = { line: 0, column: 0, white: false};
    const pixelB = { line: 15, column: 45, white: true};

    expect(distance(pixelA, pixelB)).toBe(60);
});

//

test('Shortest distance from 0,0 to self = 0', () => {
    const zeroPixel = { line: 0, column: 0, white: false};
    const testPixels = [
        { line: 0, column: 0, white: false},
    ];
    expect(findShortestDistance(zeroPixel, testPixels)).toBe(0)
});
test('Shortest distance from 0,0 = 3', () => {
    const zeroPixel = { line: 0, column: 0, white: false};
    const testPixels = [
        { line: 0, column: 3, white: false},
        { line: 3, column: 0, white: true},
        { line: 5, column: 0, white: false},
        { line: 5, column: 7, white: true},
    ];
    expect(findShortestDistance(zeroPixel, testPixels)).toBe(3)
});

//

test('Get pixels from lines to success', () => {
    const input = ['01', '10'];
    const expected = [
        [
            { line: 0, column: 0, white: false},
            { line: 0, column: 1, white: true},
        ],
        [
            { line: 1, column: 0, white: true},
            { line: 1, column: 1, white: false},
        ]
    ]
    expect(getPixels(2, input)).toEqual(expected)
});

test('Get pixels from lines to throw', () => {
    const input = ['01', '10'];
    expect(() => getPixels(3, input)).toThrowError(/expected width/)
});

//

test('Calculate bitmap from matrix', () => {
    const input = [
        [
            { line: 0, column: 0, white: false},
            { line: 0, column: 1, white: false},
            { line: 0, column: 2, white: false},
            { line: 0, column: 3, white: true},
        ],
        [
            { line: 1, column: 0, white: false},
            { line: 1, column: 1, white: false},
            { line: 1, column: 2, white: true},
            { line: 1, column: 3, white: true},
        ],
        [
            { line: 2, column: 0, white: false},
            { line: 2, column: 1, white: true},
            { line: 2, column: 2, white: true},
            { line: 2, column: 3, white: false},
        ]
    ]
    const expectedOutput = '3 2 1 0\n2 1 0 0\n1 0 0 1';
    expect(calculateBitmap(input)).toBe(expectedOutput);
});

//

test('Calculate bitmaps [single]', () => {
    const input = [
        '1',
        '3 4',
        '0001',
        '0011',
        '0110',
    ].join('\n');
    const expectedOutput = '3 2 1 0\n2 1 0 0\n1 0 0 1';
    expect(calculateBitmaps(input)).toEqual(expectedOutput);
});
test('Calculate bitmaps [multiple]', () => {
    const input = `3
3 4
0001
0011
0110

2 2
10
01

3 3
000
001
011`;
    const expectedOutput = `3 2 1 0\n2 1 0 0\n1 0 0 1
0 1\n1 0
3 2 1\n2 1 0\n1 0 0`;
    expect(calculateBitmaps(input)).toEqual(expectedOutput);
});
test('Calculate bitmaps [wrong amount] to throw', () => {
    const input = `2
3 4
0001
0011
0110`;
    expect(() => calculateBitmaps(input)).toThrowError(/bitmaps in input, found/);
});
test('Calculate bitmaps [wrong height] to throw', () => {
    const input = `1
2 2
00
00
01`;
    expect(() => calculateBitmaps(input)).toThrowError(/expected height/);
});