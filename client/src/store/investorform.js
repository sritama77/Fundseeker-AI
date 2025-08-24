import { create } from "zustand";

const SignupInvestorStore = create((set) => ({
    Password: "",
    ConfirmPassword: "",
    Username: "",
    FirmName: "",
    InvestorWebsite: "",
    InvestorLocation: "",
    InvestorSocialMedia: "",
    SelectedIndustries: [],
    SelectedStages: [],
    CheckSizeRange: [],
    BioThesis: "",
    SyndicationPreference: "",
    TicketType: [],

    setPassword: (data) => set({ Password: data }),
    setConfirmPassword: (data) => set({ ConfirmPassword: data }),
    setUsername: (data) => set({ Username: data }),
    setFirmName: (data) => set({ FirmName: data }),
    setInvestorWebsite: (data) => set({ InvestorWebsite: data }),
    setInvestorLocation: (data) => set({ InvestorLocation: data }),
    setInvestorSocialMedia: (data) => set({ InvestorSocialMedia: data }),
    setSelectedIndustries: (data) => set({ SelectedIndustries: data }),
    setSelectedStages: (data) => set({ SelectedStages: data }),
    setCheckSizeRange: (data) => set({ CheckSizeRange: data }),
    setBioThesis: (data) => set({ BioThesis: data }),
    setSyndicationPreference: (data) => set({ SyndicationPreference: data }),
    setTicketType: (data) => set({ TicketType: data }),

    // Check Size Range methods
    handleCheckSizeToggle: (size) => set((state) => ({
        CheckSizeRange: state.CheckSizeRange.includes(size)
            ? state.CheckSizeRange.filter(item => item !== size)
            : [...state.CheckSizeRange, size]
    })),
    
    removeCheckSize: (sizeToRemove) => set((state) => ({
        CheckSizeRange: state.CheckSizeRange.filter(size => size !== sizeToRemove)
    })),

    // Ticket Type methods
    handleTicketTypeToggle: (type) => set((state) => ({
        TicketType: state.TicketType.includes(type)
            ? state.TicketType.filter(item => item !== type)
            : [...state.TicketType, type]
    })),
    
    removeTicketType: (typeToRemove) => set((state) => ({
        TicketType: state.TicketType.filter(type => type !== typeToRemove)
    })),

    // Industry methods
    handleIndustryToggle: (industry) => set((state) => ({
        SelectedIndustries: state.SelectedIndustries.includes(industry)
            ? state.SelectedIndustries.filter(item => item !== industry)
            : [...state.SelectedIndustries, industry]
    })),
    
    removeIndustry: (industryToRemove) => set((state) => ({
        SelectedIndustries: state.SelectedIndustries.filter(industry => industry !== industryToRemove)
    })),

    // Stage methods
    handleStageToggle: (stage) => set((state) => ({
        SelectedStages: state.SelectedStages.includes(stage)
            ? state.SelectedStages.filter(item => item !== stage)
            : [...state.SelectedStages, stage]
    })),
    
    removeStage: (stageToRemove) => set((state) => ({
        SelectedStages: state.SelectedStages.filter(stage => stage !== stageToRemove)
    }))
}));

export default SignupInvestorStore;