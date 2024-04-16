export const links = {
  home: '/',
  welcome: '/welcome',
  dashboard: '/dashboard',
  animals: '/animals',
  users: '/users',
  userSettings: '/user/settings',
  favorites: '/user/favorites',
  featured: '#featured',
  scrollToPosition: '#scrollToPosition',
  results: (type: string) => `/${type}#scrollToPosition`,
  resultsPosition: '/results#scrollToPosition',
  search: (type: string, query: string) =>
    `/${type}?search=${query}#scrollToPosition`,
  searchDogs: '/search?search=dog',
  searchCats: '/search?search=cat',
  about: '/about',
  adoption: '/adoption',
  contact: '/contact',
  signInAPI: '/api/auth/signin',
  phone: (phoneNumber: string) => `tel:${phoneNumber}`,
  email: (email: string) => `mailto:${email}`,
  organizations: '/organizations',
  organization: (organizationId: string) => `/organization/${organizationId}`,
  organizationPets: (organizationId: string) =>
    `/organizations/${organizationId}/pets`,
  animal: (animalId: string) => `/animal/${animalId}`,
  registerAnimal: '/animal/register',
  donations: '/donations',
  donate: (petId: string) => `/donate/${petId}`,
  user: (userId: string) => `/user/${userId}`,
  redirectTo: (variant: string, id: string) => `${variant}/${id}`,
  termsOfService: '/termsOfService',
  privacyPolicy: '/privacyPolicy',
  facebook: '/tba',
};

//href
//router.push etc
