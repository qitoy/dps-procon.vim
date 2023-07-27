let s:manager = vital#procon#import('Vim.BufferManager').new()

function procon#open(name) abort
  let winid = win_getid()
  let info = s:manager.open('procon://' . a:name)
  if info.newbuf
    call setbufvar(info.bufnr, '&buftype', 'nofile')
    call setbufvar(info.bufnr, '&bufhidden', 'hide')
    call setbufvar(info.bufnr, '&swapfile', 0)
  endif
  call deletebufline(info.bufnr, 1, '$')
  call win_gotoid(winid)
endfunction

function procon#append(name, text) abort
  let bufnr = bufnr('procon://' . a:name)
  if bufnr == -1
    return
  endif
  call appendbufline(bufnr, '$', a:text)
endfunction

function procon#config(arg) abort
  if type(a:arg) == v:t_string
    echomsg denops#request('procon', 'getConfig', [a:arg])
  elseif type(a:arg) == v:t_dict
    call denops#notify('procon', 'setConfig', [a:arg])
  else
    echohl ErrorMsg
    echomsg "arg must be string or dict"
    echohl None
  endif
endfunction

function procon#modules(url) abort
  call denops#notify('procon', 'setTSModules', [a:url])
endfunction
