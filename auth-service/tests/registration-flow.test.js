import test from 'node:test';
import assert from 'node:assert/strict';

import { register, verifyRegistrationOtp } from '../src/services/auth.service.js';

test('register creates a pending user, saves its hashed OTP, delivers it, and returns userId', async () => {
  const calls = [];
  const authModel = {
    findByEmail: async () => null,
    findByPhone: async () => null,
    createUserWithOtp: async (userData, otpData) => {
      calls.push(['createUserWithOtp', userData, otpData]);
      return { id: 'user-1', ...userData };
    }
  };

  const otpService = {
    generateOtpCode: () => '123456',
    hashOtp: async (code) => `hashed-${code}`,
    sendOtp: async (data) => calls.push(['sendOtp', data])
  };

  const result = await register({ email: 'user@example.com', password: 'secret123' }, { authModel, otpService });

  assert.equal(result.userId, 'user-1');
  assert.equal(calls[0][1].status, 'PENDING_VERIFICATION');
  assert.equal(calls[0][1].isActive, false);
  assert.deepEqual(calls[0][2], {
    codeHash: 'hashed-123456',
    channel: 'EMAIL',
    purpose: 'REGISTER',
    expiresAt: result.expiresAt
  });
  assert.deepEqual(calls[1], ['sendOtp', {
    channel: 'EMAIL',
    destination: 'user@example.com',
    code: '123456'
  }]);
});

test('verifyRegistrationOtp activates the pending user after OTP validation', async () => {
  const authModel = {
    findById: async () => ({ id: 'user-2', email: 'verify@example.com', phone: null, status: 'PENDING_VERIFICATION' }),
    findLatestOtpByUserId: async () => ({ id: 'otp-2', userId: 'user-2', codeHash: 'hashed-123456', consumed: false, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }),
    activateUserAndConsumeOtp: async (userId, otpId, data) => ({ id: userId, ...data, otpId })
  };

  const otpService = {
    verifyOtp: async (inputCode, storedHash) => inputCode === '123456' && storedHash === 'hashed-123456'
  };

  const result = await verifyRegistrationOtp({ userId: 'user-2', otpCode: '123456' }, { authModel, otpService });

  assert.equal(result.user.id, 'user-2');
  assert.equal(result.user.status, 'ACTIVE');
  assert.equal(result.user.isActive, true);
  assert.equal(result.user.isEmailVerified, true);
});
