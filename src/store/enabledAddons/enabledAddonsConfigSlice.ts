import { createSlice } from '@reduxjs/toolkit'

interface EnabledAddonsStoreInterface {
  enabledAddons: any
  enabledAddonsCount: number
}

const defaultValue: EnabledAddonsStoreInterface = {
  enabledAddons: {},
  enabledAddonsCount: 0,
}

const enabledAddonsConfigSlice = createSlice({
  name: 'enabledAddonsConfig',
  initialState: {
    value: defaultValue,
  },
  reducers: {
    setEnabledAddonsAction(stage, e) {
      stage.value.enabledAddons = e.payload.addons
      stage.value.enabledAddonsCount = e.payload.count
    },
  },
})

export default enabledAddonsConfigSlice.reducer
export const { setEnabledAddonsAction } = enabledAddonsConfigSlice.actions

export type { EnabledAddonsStoreInterface }
