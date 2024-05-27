import { prisma } from '~/lib/db';
import { catBreeds, dogBreeds } from '~/static/breeds';

async function seed() {
  try {
    const alice = await prisma.user.upsert({
      where: { email: 'alice@podopieczni.pl' },
      update: {},
      create: {
        email: 'alice@podopieczni.pl',
        name: 'Alice',
        role: 'Adopter',
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: '2468013579',
            access_token: '987654321',
            expires_at: 16880581191,
            token_type: 'Bearer',
            scope: 'openid profile email',
          },
        },
      },
    });

    const bob = await prisma.user.upsert({
      where: { email: 'bob@podopieczni.pl' },
      update: {},
      create: {
        email: 'bob@podopieczni.pl',
        name: 'Bob',
        role: 'Admin',
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: '123456789',
            access_token: '2468013579',
            expires_at: 16880481191,
            token_type: 'Bearer',
            scope: 'openid profile email',
          },
        },
      },
    });

    const kate = await prisma.user.upsert({
      where: { email: 'kate@podopieczni.pl' },
      update: {},
      create: {
        email: 'kate@podopieczni.pl',
        name: 'Kate',
        role: 'Shelter',
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: '987654321',
            access_token: '123456789',
            expires_at: 16880681191,
            token_type: 'Bearer',
            scope: 'openid profile email',
          },
        },
      },
    });

    const shelter1 = await prisma.shelter.create({
      data: {
        name: 'Schronisko na Paluchu',
        taxId: '5223190230',
        members: {
          connect: [{ id: alice.id }, { id: bob.id }],
        },
      },
    });

    const shelter2 = await prisma.shelter.create({
      data: {
        name: 'Schronisko dla zwierząt w Gaju',
        taxId: '5470048840',
        members: {
          connect: { id: kate.id },
        },
      },
    });

    const breedsMap: Record<string, string> = {};

    [...catBreeds, ...dogBreeds].forEach((breed) => {
      breedsMap[breed.en] = breed.pl;
    });

    const cockerSpaniel = breedsMap['Cocker Spaniel'];
    const siamese = breedsMap['Siamese'];

    await prisma.pet.create({
      data: {
        name: 'Archie',
        species: 'Dog',
        breed: cockerSpaniel,
        weight: 10,
        dateOfBirth: new Date('2023-01-11'),
        shelter: { connect: { id: shelter1.id } },
      },
    });

    await prisma.pet.create({
      data: {
        name: 'Whiskers',
        species: 'Dog',
        breed: cockerSpaniel,
        weight: 13.5,
        dateOfBirth: new Date('2020-01-01'),
        shelter: { connect: { id: shelter1.id } },
      },
    });

    await prisma.pet.create({
      data: {
        name: 'Whiskers',
        species: 'Cat',
        breed: siamese,
        weight: 5.5,
        dateOfBirth: new Date('2020-01-05'),
        shelter: { connect: { id: shelter2.id } },
      },
    });

    await prisma.addressInfo.create({
      data: {
        address: 'Na Paluchu 2',
        city: 'Warszawa',
        state: 'Mazowieckie',
        country: 'Polska',
        lat: '52.22977',
        lng: '21.01178',
        postCode: '04-123',
        shelter: { connect: { id: shelter1.id } },
      },
    });

    await prisma.addressInfo.create({
      data: {
        address: 'Mrówcza 710',
        city: 'Łódź',
        state: 'Łódzkie',
        country: 'Polska',
        lat: '51.75',
        lng: '19.46667',
        postCode: '04-123',
        shelter: { connect: { id: shelter2.id } },
      },
    });

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
