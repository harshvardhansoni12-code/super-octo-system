import prisma from './src/lib/prisma.js';
console.log('prisma object?', !!prisma);
console.log(Object.keys(prisma || {}));
console.log('user property', prisma && prisma.user);
