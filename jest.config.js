module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./src/__tests__/setupJestEnv.ts'], // 测试前全局配置文件
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/components/**',
    'src/views/**',
    'src/utils/**',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/fileTransformer.ts',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.spec.ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'vue'],
  rootDir: __dirname,
  roots: ['<rootDir>'],
}
