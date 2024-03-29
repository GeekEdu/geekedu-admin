import { createSlice } from '@reduxjs/toolkit'

interface SystemConfigStoreInterface {
  system?: {
    logo?: string
    url?: {
      api?: string
      wx?: string
      pc?: string
    }
  }
  video?: {
    default_service?: string
  }
}

const systemConfigSlice = createSlice({
  name: 'systemConfig',
  initialState: {
    value: {},
  },
  reducers: {
    saveConfigAction(stage, e) {
      stage.value = e.payload
    },
  },
})

export default systemConfigSlice.reducer
export const { saveConfigAction } = systemConfigSlice.actions

export type { SystemConfigStoreInterface }
