#!/bin/bash
echo "🔄 REVERTING HOMEPAGE UPLOAD CHANGES..."
echo "======================================"
echo ""

# Revert signup.ejs
if [ -f "src/views/signup.ejs.backup-upload-enhancement" ]; then
    cp src/views/signup.ejs.backup-upload-enhancement src/views/signup.ejs
    echo "✅ Reverted src/views/signup.ejs"
else
    echo "❌ Backup file not found: src/views/signup.ejs.backup-upload-enhancement"
fi

# Revert signup.css
if [ -f "src/public/css/signup.css.backup-upload-enhancement" ]; then
    cp src/public/css/signup.css.backup-upload-enhancement src/public/css/signup.css
    echo "✅ Reverted src/public/css/signup.css"
else
    echo "❌ Backup file not found: src/public/css/signup.css.backup-upload-enhancement"
fi

# Revert signup.js
if [ -f "src/public/js/signup.js.backup-upload-enhancement" ]; then
    cp src/public/js/signup.js.backup-upload-enhancement src/public/js/signup.js
    echo "✅ Reverted src/public/js/signup.js"
else
    echo "❌ Backup file not found: src/public/js/signup.js.backup-upload-enhancement"
fi

echo ""
echo "🔄 REVERT COMPLETE!"
echo "=================="
echo ""
echo "✅ All homepage upload enhancements have been reverted"
echo "🌐 Test your reverted signup page: http://localhost:3003/admin/signup"
echo ""
echo "📋 Reverted Files:"
echo "   • src/views/signup.ejs"
echo "   • src/public/css/signup.css"
echo "   • src/public/js/signup.js"
echo ""
echo "✨ The signup page is now back to its original state!"
