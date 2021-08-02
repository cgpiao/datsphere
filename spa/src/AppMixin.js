const WIDTH_SIDEBAR = 0
const WIDTH_DETAIL = 640
const HEIGHT_HEADER_APP = 48
export default {
    computed: {
        window() {
            return window
        }
    },
    data() {
        return {
            sidebarWidth: WIDTH_SIDEBAR,
            detailWidth: WIDTH_DETAIL,
            appHeaderHeight: HEIGHT_HEADER_APP
        }
    }

}
