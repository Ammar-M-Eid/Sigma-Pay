const { test } = require('node:test');
const assert = require('node:assert/strict');
const { GroupSavingsService } = require('../dist/services/services');

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

test('creates a group and persists it', () => {
  const { service, calls, groups } = fixture();
  const group = sampleGroup();
  assert.equal(service.createGroup(group), 'G-104');
  assert.equal(groups.get('G-104'), group);
  assert.deepEqual(calls, [['save', 'G-104']]);
});

test('joining a group adds a member once and verifies repository calls', () => {
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

test('contributes to a known group and leaves an unknown group unchanged', () => {
  const { service, calls } = fixture();
  const group = sampleGroup();
  service.createGroup(group);
  calls.length = 0;
  service.contribute('G-104', 'U-9', 500);
  assert.equal(group.currentAmount.amount, 2900);
  assert.deepEqual(calls, [['findById', 'G-104'], ['save', 'G-104']]);
  calls.length = 0;
  service.contribute('missing', 'member-1', 10);
  assert.deepEqual(calls, [['findById', 'missing']]);
  assert.equal(group.currentAmount.amount, 2900);
});

test('reports a group snapshot and returns a not found result for an invalid id', () => {
  const { service } = fixture();
  service.createGroup(sampleGroup());
  assert.equal(service.generateGroupReport('G-104'), 'Group: Family trip\nTarget: 12000 EGP\nCurrent: 2400 EGP\nMembers: 2');
  assert.equal(service.generateGroupReport('missing'), 'Group not found');
});
