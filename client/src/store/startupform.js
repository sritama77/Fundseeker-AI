import {create} from "zustand"

const SignupStartupStore = create((set, get) => ({
    Password: "",
    ConfirmPassword: "",
    StartupName: "",
    CompanyEmail: "",
    FounderName: "",
    StartupWebsiteUrl: "",
    Location: "",
    SocialMediaLink: "",
    CurrentStage: "",
    StartupIndustryCategories: [],
    BriefPitch: "",
    ProblemStatement: "",
    Solution: "",
    BusinessModel: "",
    ElevatorPitch: "",
    Competitors: "",

    setPassword: (data) => set({Password: data}),
    setConfirmPassword: (data) => set({ConfirmPassword: data}),
    setStartupName: (data) => set({StartupName: data}),
    setCompanyEmail: (data) => set({CompanyEmail: data}),
    setFounderName: (data) => set({FounderName: data}),
    setStartupWebsiteUrl: (data) => set({StartupWebsiteUrl: data}),
    setLocation: (data) => set({Location: data}),
    setSocialMediaLink: (data) => set({SocialMediaLink: data}),
    setCurrentStage: (data) => set({CurrentStage: data}),
    setStartupIndustryCategories: (data) => set({StartupIndustryCategories: data}),
    setBriefPitch: (data) => set({BriefPitch: data}),
    setProblemStatement: (data) => set({ProblemStatement: data}),
    setSolution: (data) => set({Solution: data}),
    setBusinessModel: (data) => set({BusinessModel: data}),
    setElevatorPitch: (data) => set({ElevatorPitch: data}),
    setCompetitors: (data) => set({Competitors: data}),

    // Industry toggle and remove methods
    handleIndustryToggle: (industry) => set((state) => ({
        StartupIndustryCategories: state.StartupIndustryCategories.includes(industry)
            ? state.StartupIndustryCategories.filter(item => item !== industry)
            : [...state.StartupIndustryCategories, industry]
    })),
    
    removeIndustry: (industryToRemove) => set((state) => ({
        StartupIndustryCategories: state.StartupIndustryCategories.filter(industry => industry !== industryToRemove)
    }))
}))

export default SignupStartupStore;