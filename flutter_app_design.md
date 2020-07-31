# Flutter App 規劃

## MaterialApp

```javascript=
 MaterialApp(
        builder: (context, widget) {
          return MediaQuery(
          // This will ignore the system-wide text size settings.
            data: MediaQuery.of(context).copyWith(textScaleFactor: 1),
            child: Stack(
              children: <Widget>[
                widget,
                // 可以作為全域錯誤訊息顯示的地方
                AlertLayer(_navigator)
              ],
            ),
          );
        },
        title: 'MyApp',
        navigatorKey: _navigator,
        // ThemeData 亮暗模式寫在這裡
        theme: ThemeData(
          brightness: Brightness.light,
          primaryColor: Color(0xffD9D9DC), 
          primaryColorDark: Color(0xffC0C0C3),
          dividerTheme: DividerThemeData(color: Colors.white),
          iconTheme: IconThemeData(color: Colors.black),
          inputDecorationTheme: InputDecorationTheme(
            fillColor: Colors.white,
          ),
          dialogBackgroundColor: Color(0xffD9D9DC),
        ),
        darkTheme: ThemeData(
          brightness: Brightness.dark,
          primaryColorDark: Color(0xffC0C0C3),
          dividerTheme: DividerThemeData(color: Colors.grey),
          iconTheme: IconThemeData(color: Colors.white),
          inputDecorationTheme:
              InputDecorationTheme(fillColor: Color(0xff4e4946)),
        ),
        // Navigation的邏輯
        routes: {
          '/': (ctx) => MainPage(),
          SubPage.routeName: (ctx) => SubPage(),
         ,
        },
        localizationsDelegates: [
          const I18nDelegate(),
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        // i18n
        // 支持的語系
        supportedLocales: [
          const Locale('en'),
          const Locale('ja', 'JP'),
        ],
        // 選擇使用哪個語系的邏輯
        localeListResolutionCallback: (deviceLocales, supportedLocales) {
          Locale locale = supportedLocales.toList()[0];
          for(Locale deviceLocale in deviceLocales) {
            if(I18nDelegate().isSupported(deviceLocale)) {
              locale = deviceLocale;
              break;
            }
          }
          Intl.defaultLocale = locale.languageCode;
          return locale;
        },
      ),
    
```
