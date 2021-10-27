const express = require('express');
const { ExpectationFailed } = require('http-errors');
const {requireParams} = require('../middleware/account-middleware')
const app = require('../app');

it('given a list of parameters, checkParams() validates params and calls next()', () => {
    const paramsNeeded = ['postal_code', 'email'];
    let paramMock = jest.fn(requireParams);
    paramMock(paramsNeeded)
    expect(paramMock).toHaveBeenCalled();
    expect(paramMock).toHaveBeenCalledTimes(1);
    expect(paramMock.mock.calls[0][0]).toStrictEqual(['postal_code', 'email'])

})