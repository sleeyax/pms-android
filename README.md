# pms-android

**NO LONGER MAINTAINED. Since PimpMyStremio doesn't seem to be actively maintained anymore it doesn't make sense to me to develop this project any further as well.**

---

Run [PimpMyStremio](https://github.com/sungshon/PimpMyStremio) as a hybrid app on android. 
No [hacks with Termux](https://gist.github.com/sleeyax/e9635eb352a4fcdf94194f763d743689) required.

Please note that this app is experimental and not being developed by the original developer of PMS.

## FAQ
**Why is this apps so big (100 MB)?**

Because PMS is built with NodeJS - and android doesn't support NodeJS natively - the whole Node runtime must be bundled with the application. That by itself is +- 50 MB already. The remaining megabytes are a result of all dependenices that need to be bundled as well.

**Streams sometimes don't load anymore untill I reopen the app**

PMS has to keep running in the background in order to work. Your phone might have an aggressive battery saver enabled that's restricting or disabling PMS while it runs in the background. Please refer to [dontkillmyapp.com](https://dontkillmyapp.com/) for device specific instructions on how to disable it.

**Addon X is not working?!**

Not my fault. Some addons require dependencies that are not supported on android and thus will not work. See [this issue on the PMS repo](https://github.com/sungshon/PimpMyStremio/issues/51) for more information.

**\<insert any PMS feature here\> is not working?!**

For any issue unrelated to this app, please [report it at the PMS repo](https://github.com/sungshon/PimpMyStremio/issues).

**Something is wrong with the app!**

Open an issue [here](https://github.com/sleeyax/pms-android/issues) describing what you expected to happen, what actually happened and optionally attach your application log file. Said log file can be found at `/sdcard/Android/data/com.androidjs.sleeyax.pms/files/log.txt`.

## Screenshots
![screenshot 1](https://i.imgur.com/RGrIfzn.jpeg)
![screenshot 2](https://i.imgur.com/N8OKq1b.jpeg)

## Developers
### Setup
```Bash
$ git submodule init
$ npm install
```

### Build
Production:
```bash
$ npm run build
```

Development: 
```bash
$ npm run build:debug
```

## Sign APK
```bash
$ apksigner sign --ks <path_to_keystore> --out dist/pms-android-vxxx-beta.apk dist/pms-android.apk
$ apksigner verify dist/pms-android-vxxx-beta.apk
```

