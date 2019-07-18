const arrayFunctions = require('../lib/arrayFunctions');

describe('Helper function test', () => {
    it('Convert type of string into number', () => {
        var result = parseInt('60');
        result = typeof result;
        expect(result).toEqual('number')
    })

    it('Should get not a number', () => {
        var result = parseInt('string');
        expect(result).toBeNaN();
    })

    it('Should return mean value 1', () => {
        const resposneArray = [{
            'key1': 1,
            'key2': 2,
            'key3': 4,
            'key4': 5
        }, {
            'key1': 1,
            'key2': 2,
            'key3': 4,
            'key4': 5
        }]
        const keyname = 'key1';
        const data = arrayFunctions.getValueFromArray(resposneArray, keyname, 4);
        expect(data).toBe(1)
    })

    it('Should return median value 1', () => {
        const resposneArray = [{
            'key1': 1,
            'key2': 2,
            'key3': 4,
            'key4': 5
        }]
        const keyname = 'key1';
        const data = arrayFunctions.getValueFromArray(resposneArray, keyname, 5);
        expect(data).toBe(1)
    })

    it('Should return json ', () => {
        const resposneArray = [{
            'key1': 1,
            'key2': 2,
            'key3': 4,
            'key4': 5
        }];
        const keyname = 'key1';
        const data = arrayFunctions.getValueFromArray(resposneArray, keyname, 2)
        expect(data).toMatchObject({ "key1": 1, "key2": 2, "key3": 4, "key4": 5 })
    })

})
