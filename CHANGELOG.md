## [0.8.1](https://github.com/DimRev/fitness-app-v2/compare/v0.8.0...v0.8.1) (2024-09-21)


### Bug Fixes

* Add FoodItemBadge, and food item/food item pending cards ([8381ef9](https://github.com/DimRev/fitness-app-v2/commit/8381ef9ebedc0754b3290740165fa7b55d80a3f9))
* FoodItemPreview card style fixed ([79a84b3](https://github.com/DimRev/fitness-app-v2/commit/79a84b39a69824d9e6b1d6c7bb9c12d555b4f6f0))

# [0.8.0](https://github.com/DimRev/fitness-app-v2/compare/v0.7.0...v0.8.0) (2024-09-21)


### Bug Fixes

* Consuming meal invalidates get_meal_by_id store ([d9a46c0](https://github.com/DimRev/fitness-app-v2/commit/d9a46c00070703402e0d90cd382bf7faadbf5770))
* Fix image upload logic ([f5a74a0](https://github.com/DimRev/fitness-app-v2/commit/f5a74a09f339bd3eead95e0cd05da9a308bfc446))
* fix page calculations of GetFoodItems ([eebb37f](https://github.com/DimRev/fitness-app-v2/commit/eebb37f20e3220fb3005c1d003c77b19780ae109))
* fix query key params for consume meal invalidations ([8980d86](https://github.com/DimRev/fitness-app-v2/commit/8980d86ffe7916e0217f3da4addb5d1ddb50d36f))


### Features

* Add admin food item page ([76ee370](https://github.com/DimRev/fitness-app-v2/commit/76ee3704746f1458cc43fb62d275cd3a418a3630))
* Add delete food item path, implament admin food item deletion ([2ff7b4b](https://github.com/DimRev/fitness-app-v2/commit/2ff7b4bb47f8d52aee3d9526dc9db1c3671639fd))
* Add FoodItemsAdminTable and it's hook ([716e82a](https://github.com/DimRev/fitness-app-v2/commit/716e82a04ef3c3116d04d439bfd67e67f3881087))
* Admin update food item working ([6c19ae1](https://github.com/DimRev/fitness-app-v2/commit/6c19ae1ab7c2fdaf1595cacb9a6499856b960f3f))
* Create global confirmation dialog ([b8694a8](https://github.com/DimRev/fitness-app-v2/commit/b8694a8d2ce9ab12fb4021a60705c1082c48c931))
* Setup public route for getting food item by id ([e8acea9](https://github.com/DimRev/fitness-app-v2/commit/e8acea94dade28754b675f09ae315830914afd5c))

# [0.7.0](https://github.com/DimRev/fitness-app-v2/compare/v0.6.0...v0.7.0) (2024-09-20)


### Features

* Add Notifications cmp in ui ([aa60979](https://github.com/DimRev/fitness-app-v2/commit/aa6097966cc1c588e1e5ea62c2b383b11a5f9152))
* Imlament bscuffolding of websocket ([012b980](https://github.com/DimRev/fitness-app-v2/commit/012b980d80c99acf46a1dba7ec88559e3e405af0))

# [0.6.0](https://github.com/DimRev/fitness-app-v2/compare/v0.5.0...v0.6.0) (2024-09-16)


### Features

* Add consume meal endpoints to server ([5b979a3](https://github.com/DimRev/fitness-app-v2/commit/5b979a332cd6e40c7c99932190a9db1e61fa658e))
* add main calendar ([c84725a](https://github.com/DimRev/fitness-app-v2/commit/c84725a5c2d53d9ecfac586fcef40901b5c21c0c))
* Record meals consumed client ([ea68d04](https://github.com/DimRev/fitness-app-v2/commit/ea68d04f793b4462f590bd0dfd58306beaf6401a))

# [0.5.0](https://github.com/DimRev/fitness-app-v2/compare/v0.4.1...v0.5.0) (2024-09-15)


### Features

* Add toaster ([366a065](https://github.com/DimRev/fitness-app-v2/commit/366a065d040f5bcb2f200e2e743d0e48c8dcc65b))

## [0.4.1](https://github.com/DimRev/fitness-app-v2/compare/v0.4.0...v0.4.1) (2024-09-14)


### Bug Fixes

* install certificates on docker container to access AWS ([b741c1e](https://github.com/DimRev/fitness-app-v2/commit/b741c1ebed0becef778eb3cc95bdeedebbaeb05d))

# [0.4.0](https://github.com/DimRev/fitness-app-v2/compare/v0.3.0...v0.4.0) (2024-09-14)


### Features

* Add conn to s3 ([c921a1a](https://github.com/DimRev/fitness-app-v2/commit/c921a1aafd7f0ec4d91dbdcad1e242843cf8cf03))
* Implement upload for food image ([2ed269d](https://github.com/DimRev/fitness-app-v2/commit/2ed269d04d920125c6f170951ab6524fe9596387))
* **upload-server:** Add upload endpoint in the server ([fe59e58](https://github.com/DimRev/fitness-app-v2/commit/fe59e58ec579202afb6a93d71a8793ad7676bb7e))

# [0.3.0](https://github.com/DimRev/fitness-app-v2/compare/v0.2.0...v0.3.0) (2024-09-13)


### Bug Fixes

* permission problems with label ci ([c3c6d02](https://github.com/DimRev/fitness-app-v2/commit/c3c6d02a6709b717e4b48955cb36c755a7ddd1a2))


### Features

* **layout:** Add settings dialog edit current user settings ([bbdf0fa](https://github.com/DimRev/fitness-app-v2/commit/bbdf0fa7b8b6ac8ee650976cf38de1babe3212bb))

# [0.2.0](https://github.com/DimRev/fitness-app-v2/compare/v0.1.2...v0.2.0) (2024-09-12)


### Features

* **meal-client:** Add meal edit page and meal edit form ([22e8fa0](https://github.com/DimRev/fitness-app-v2/commit/22e8fa0be2c30c9b70d96515e511769aaba8b49e))
* **meal-server:** Handle update meal ([f6a39b9](https://github.com/DimRev/fitness-app-v2/commit/f6a39b98f40a74c16ee9edb68238a5fe97b22a65))

## [0.1.2](https://github.com/DimRev/fitness-app-v2/compare/v0.1.1...v0.1.2) (2024-09-12)


### Bug Fixes

* setup deploy script based on fly's docs ([0659997](https://github.com/DimRev/fitness-app-v2/commit/06599975cc16ca933f0740612e0643c8af146356))

## [0.1.1](https://github.com/DimRev/fitness-app-v2/compare/v0.1.0...v0.1.1) (2024-09-12)


### Bug Fixes

* fixing deploy issue ([fc23a59](https://github.com/DimRev/fitness-app-v2/commit/fc23a594e9ecebae1b3b9af2e65246e90dd95b6d))

# [0.1.0](https://github.com/DimRev/fitness-app-v2/compare/v0.0.2...v0.1.0) (2024-09-12)


### Bug Fixes

* Rework Release and Deploy ([df99b46](https://github.com/DimRev/fitness-app-v2/commit/df99b461677ff4d1d07ea42bf75e1567a1766b04))
* two runs in a single block ([5a3da16](https://github.com/DimRev/fitness-app-v2/commit/5a3da167b889d74652702ec6bf23bdaecad8875d))


### Features

* deploy to fly though cd ([11089db](https://github.com/DimRev/fitness-app-v2/commit/11089dbb4c71806eb33d9923a8114fea50618459))

## [0.0.2](https://github.com/DimRev/fitness-app-v2/compare/v0.0.1...v0.0.2) (2024-09-12)


### Bug Fixes

* config the pnpm version the ci should use ([a0b2b3d](https://github.com/DimRev/fitness-app-v2/commit/a0b2b3d65eccb022168750e801b644fcfee976b4))
* give token write permissions ([76c48c9](https://github.com/DimRev/fitness-app-v2/commit/76c48c9af5784ec5cd3c31163847ece0a23cd7fc))
* node version setup to 20.8.1 in ci ([66a378c](https://github.com/DimRev/fitness-app-v2/commit/66a378c34baca6191d08fa5ee458abb097acd4ea))
* testing semantic-release ([417f80e](https://github.com/DimRev/fitness-app-v2/commit/417f80efb2223d59be14bdf2f6756201ea90efce))
