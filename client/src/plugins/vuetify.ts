import 'vuetify/styles/main.css'
import { createVuetify } from 'vuetify'
// import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.min.css'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: "#FF1744",
                    background: '#efefef',
                }
            },
            dark: {
                colors: {
                    primary: "#FFC107",
                }
            }
        }
    }
})