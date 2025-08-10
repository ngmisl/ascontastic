import { useState } from 'react';
import { useCryptoStore } from '@/stores/crypto-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function LockScreen() {
  const { unlock, hasVault } = useCryptoStore();
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (!password) {
      toast.error('Please enter your master password.');
      return;
    }
    setIsUnlocking(true);
    const success = await unlock(password);
    if (!success) {
      toast.error('Incorrect password. Please try again.');
      setIsUnlocking(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-sm glass-card">
        <CardHeader>
          <CardTitle className="text-center">
            {hasVault ? 'Unlock Vault' : 'Create New Vault'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            {hasVault
              ? 'Enter your master password to unlock your encrypted data.'
              : 'Create a master password to secure your new vault.'}
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
          </div>
          <Button onClick={handleUnlock} disabled={isUnlocking} className="w-full">
            {isUnlocking ? 'Unlocking...' : (hasVault ? 'Unlock' : 'Create Vault')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
