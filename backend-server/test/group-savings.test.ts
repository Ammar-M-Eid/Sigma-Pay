import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GroupSavingsService } from '../src/services/services';

function fixture() {
  const groups = new Map();
  const calls = [];
  const repository = {
    save(group) { calls.push(['save', group.groupId]); groups.set(group.groupId, group); return group.groupId; },
    findById(id) { calls.push(['findById', id]); return groups.get(id) || null; },
  };
  return { service: new GroupSavingsService(repository), groups, calls };
}

function sampleGroup() {
  const currency = { code: 'EGP', symbol: 'E£', exchangeRate: 1 };
  return { groupId: 'G-104', groupName: 'Family trip', targetAmount: { amount: 12000, currency }, currentAmount: { amount: 2400, currency }, members: ['U-7', 'U-9'] };
}

test('TC-GROUP-001 creates a savings group and persists it', () => {
  const { service, calls, groups } = fixture();
  const group = sampleGroup();
  assert.equal(service.createGroup(group), 'G-104');
  assert.equal(groups.get('G-104'), group);
  assert.deepEqual(calls, [['save', 'G-104']]);
});

test('TC-GROUP-002 joins a member once and avoids duplicate membership', () => {
  const { service, calls } = fixture();
  const group = sampleGroup();
  service.createGroup(group);
  calls.length = 0;
  service.joinGroup('G-104', 'U-10');
  assert.deepEqual(group.members, ['U-7', 'U-9', 'U-10']);
  assert.deepEqual(calls, [['findById', 'G-104'], ['save', 'G-104']]);
  calls.length = 0;
  service.joinGroup('G-104', 'U-10');
  assert.deepEqual(calls, [['findById', 'G-104']]);
});

test('TC-GROUP-003 records member contributions and rejects invalid or non-member deposits', () => {
  const { service, calls } = fixture();
  const group = sampleGroup();
  service.createGroup(group);
  calls.length = 0;
  assert.equal(service.contribute('G-104', 'U-9', 500), true);
  assert.equal(group.currentAmount.amount, 2900);
  assert.deepEqual([...group.contributions ?? []], [['U-9', 500]]);
  assert.deepEqual(calls, [['findById', 'G-104'], ['save', 'G-104']]);
  calls.length = 0;
  assert.equal(service.contribute('missing', 'member-1', 10), false);
  assert.deepEqual(calls, [['findById', 'missing']]);
  assert.equal(service.contribute('G-104', 'U-88', 20), false);
  assert.equal(service.contribute('G-104', 'U-9', -1), false);
  assert.equal(group.currentAmount.amount, 2900);
});

test('TC-GROUP-004 reports group targets, member contributions and handles an unknown group', () => {
  const { service } = fixture();
  const group = sampleGroup();
  group.contributions = new Map([['U-7', 1000], ['U-9', 1400]]);
  service.createGroup(group);
  assert.equal(service.generateGroupReport('G-104'), 'Group: Family trip\nTarget: 12000 EGP\nCurrent: 2400 EGP\nMembers: 2\nContributions:\nU-7: 1000 EGP\nU-9: 1400 EGP');
  assert.equal(service.generateGroupReport('missing'), 'Group not found');
});

