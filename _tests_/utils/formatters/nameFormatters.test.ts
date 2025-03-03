import {
  formatLocationName,
  removeParentheses,
  toCamelCase,
} from '@/utils/formatters/nameFormatters'

describe('toCamelCase', () => {
  it('should convert a lowercase string to Camel Case', () => {
    const input = 'hello world'
    const result = toCamelCase(input)
    expect(result).toBe('Hello World')
  })

  it('should convert a single word to Camel Case', () => {
    const input = 'hello'
    const result = toCamelCase(input)
    expect(result).toBe('Hello')
  })

  it('should handle a capitalized sentence correctly', () => {
    const input = 'Hello World'
    const result = toCamelCase(input)
    expect(result).toBe('Hello World')
  })

  it('should return an empty string if given an empty string', () => {
    const input = ''
    const result = toCamelCase(input)
    expect(result).toBe('')
  })

  it('should handle multiple spaces between words', () => {
    const input = 'Hello  World'
    const result = toCamelCase(input)
    expect(result).toBe('Hello World')
  })

  it('should ignore special characters within words', () => {
    expect(toCamelCase('hello-world')).toBe('Hello-world')
  })

  it('should handle punctuation correctly', () => {
    expect(toCamelCase('hello, world!')).toBe('Hello, World!')
  })

  it('should handle numbers in the string', () => {
    expect(toCamelCase('hello 123 world')).toBe('Hello 123 World')
  })
})

describe('removeParentheses', () => {
  it('should remove parentheses from a string', () => {
    const input = 'Hello (World)'
    const result = removeParentheses(input)
    expect(result).toEqual('Hello World')
  })

  it('should remove parentheses from a single word', () => {
    const input = '(Hello)'
    const result = removeParentheses(input)
    expect(result).toEqual('Hello')
  })

  it('should remove parentheses from a string with special characters', () => {
    const input = '(Hello)-World'
    const result = removeParentheses(input)
    expect(result).toEqual('Hello-World')
  })

  it('should remove multiple parentheses', () => {
    const input = '((Hello)) World'
    const result = removeParentheses(input)
    expect(result).toEqual('Hello World')
  })

  it('should return the same string if no parentheses are present', () => {
    expect(removeParentheses('Hello World')).toBe('Hello World')
  })

  it('should return an empty string if given an empty string', () => {
    expect(removeParentheses('')).toBe('')
  })

  it('should return an empty string if given only parentheses', () => {
    expect(removeParentheses('()')).toBe('')
  })

  it('should retain special characters inside parentheses', () => {
    const input = 'Hello (!@#) World'
    const result = removeParentheses(input)
    expect(result).toEqual('Hello !@# World')
  })

  it('should remove parentheses around numbers', () => {
    expect(removeParentheses('Call me (123) 456-7890')).toBe('Call me 123 456-7890')
  })
})

describe('formatLocationName', () => {
  it('should format airport and city names correctly', () => {
    const input = 'London Gatwick Airport (london)'
    const result = formatLocationName(input)
    expect(result).toEqual({ airportName: 'London Gatwick Airport', cityName: 'London' })
  })

  it('Should handle extra spaces', () => {
    const input = 'London  Gatwick Airport  (london)'
    const result = formatLocationName(input)
    expect(result).toEqual({ airportName: 'London Gatwick Airport', cityName: 'London' })
  })

  it('should handle names with special characters', () => {
    const input = 'charles de gaulle (paris-france)'
    const result = formatLocationName(input)
    expect(result).toEqual({ airportName: 'Charles De Gaulle', cityName: 'Paris-france' })
  })

  it('should return just airport name if parentheses are missing', () => {
    const input = 'dubai international airport'
    const result = formatLocationName(input)
    expect(result).toEqual({ airportName: 'Dubai International Airport', cityName: '' })
  })

  it('should return empty strings when input is empty', () => {
    const input = ''
    const result = formatLocationName(input)
    expect(result).toEqual({ airportName: '', cityName: '' })
  })
})
