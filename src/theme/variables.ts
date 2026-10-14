export const espaciado = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};

export const layout = {
    radius: 10,         
    radiusLg: 14,    
    radiusXl: 18,      
    containerPadding: 32,
    maxWidth: 1400,
};

export const tipografia = {
    title: { fontFamily: 'Poppins-Bold', fontSize: 28 },
    subtitle: { fontFamily: 'Poppins-SemiBold', fontSize: 22 },
    heading: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
    body: { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 },
    small: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
    button: { fontFamily: 'Inter-SemiBold', fontSize: 16 },
};

export const sombras = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        elevation: 12,
    },
} as const;
