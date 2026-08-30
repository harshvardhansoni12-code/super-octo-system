const service = {
  name: 'Ravi Sharma',
  email: `ravi.service+${Date.now()}@example.com`,
  password: 'secret123',
  phone: '9876543210',
  location: 'Pune',
  serviceType: 'IRRIGATION',
  description: 'Irrigation setup and maintenance service'
};

const goods = {
  name: 'Suresh Patil',
  email: `suresh.goods+${Date.now()}@example.com`,
  password: 'secret123',
  companyName: 'Agri Supply Co.',
  phone: '9988776655',
  location: 'Nashik',
  goods: ['SEEDS', 'FERTILIZER']
};

const requests = [
  ['service', service, 'http://localhost:3000/api/v1/service-provider/register'],
  ['goods', goods, 'http://localhost:3000/api/v1/goods-provider/register']
];

for (const [label, payload, url] of requests) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log('--- ' + label.toUpperCase() + ' ---');
  console.log('STATUS:', res.status);
  console.log(text);
}
