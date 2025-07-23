
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Upload {
  id: string;
  userId: string;
  companyId: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: 'enviado' | 'processando' | 'erro';
}

export interface CompanyDocumentConfig {
  companyId: string;
  allowedDocuments: string[];
}

interface UploadsContextType {
  uploads: Upload[];
  companyConfigs: CompanyDocumentConfig[];
  addUpload: (upload: Omit<Upload, 'id' | 'uploadDate'>) => void;
  getUploadsForCompany: (companyId: string) => Upload[];
  getUploadsForCompanyAndType: (companyId: string, documentType: string) => Upload[];
  updateCompanyConfig: (companyId: string, allowedDocuments: string[]) => void;
  getCompanyConfig: (companyId: string) => string[];
  getUploadCountForMonth: (companyId: string, documentType: string) => number;
  getLastUploadDate: (companyId: string, documentType: string) => string | null;
}

const UploadsContext = createContext<UploadsContextType | undefined>(undefined);

export const UploadsProvider = ({ children }: { children: ReactNode }) => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [companyConfigs, setCompanyConfigs] = useState<CompanyDocumentConfig[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUploads = localStorage.getItem('fiscai_uploads');
    const storedConfigs = localStorage.getItem('fiscai_company_configs');
    
    if (storedUploads) {
      try {
        setUploads(JSON.parse(storedUploads));
      } catch (error) {
        console.error('Error loading uploads from localStorage:', error);
      }
    }

    if (storedConfigs) {
      try {
        setCompanyConfigs(JSON.parse(storedConfigs));
      } catch (error) {
        console.error('Error loading company configs from localStorage:', error);
      }
    }
  }, []);

  // Save uploads to localStorage whenever uploads change
  useEffect(() => {
    localStorage.setItem('fiscai_uploads', JSON.stringify(uploads));
  }, [uploads]);

  // Save company configs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fiscai_company_configs', JSON.stringify(companyConfigs));
  }, [companyConfigs]);

  const addUpload = (uploadData: Omit<Upload, 'id' | 'uploadDate'>) => {
    const newUpload: Upload = {
      ...uploadData,
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    
    setUploads(prev => [...prev, newUpload]);
  };

  const getUploadsForCompany = (companyId: string) => {
    return uploads.filter(upload => upload.companyId === companyId);
  };

  const getUploadsForCompanyAndType = (companyId: string, documentType: string) => {
    return uploads.filter(upload => 
      upload.companyId === companyId && upload.documentType === documentType
    );
  };

  const updateCompanyConfig = (companyId: string, allowedDocuments: string[]) => {
    setCompanyConfigs(prev => {
      const existing = prev.find(config => config.companyId === companyId);
      if (existing) {
        return prev.map(config => 
          config.companyId === companyId 
            ? { ...config, allowedDocuments }
            : config
        );
      } else {
        return [...prev, { companyId, allowedDocuments }];
      }
    });
  };

  const getCompanyConfig = (companyId: string): string[] => {
    const config = companyConfigs.find(c => c.companyId === companyId);
    return config?.allowedDocuments || [];
  };

  const getUploadCountForMonth = (companyId: string, documentType: string): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return uploads.filter(upload => {
      const uploadDate = new Date(upload.uploadDate);
      return upload.companyId === companyId && 
             upload.documentType === documentType &&
             uploadDate.getMonth() === currentMonth &&
             uploadDate.getFullYear() === currentYear;
    }).length;
  };

  const getLastUploadDate = (companyId: string, documentType: string): string | null => {
    const relevantUploads = uploads
      .filter(upload => upload.companyId === companyId && upload.documentType === documentType)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    
    return relevantUploads.length > 0 ? relevantUploads[0].uploadDate : null;
  };

  return (
    <UploadsContext.Provider value={{
      uploads,
      companyConfigs,
      addUpload,
      getUploadsForCompany,
      getUploadsForCompanyAndType,
      updateCompanyConfig,
      getCompanyConfig,
      getUploadCountForMonth,
      getLastUploadDate
    }}>
      {children}
    </UploadsContext.Provider>
  );
};

export const useUploads = () => {
  const context = useContext(UploadsContext);
  if (context === undefined) {
    throw new Error('useUploads must be used within an UploadsProvider');
  }
  return context;
};
